// app/webhook-monitor/page.tsx
'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';

// --- Type Definitions ---
type WebhookEvent = {
  id: string;
  timestamp: Date;
  source: string;
  eventType: string;
  payload: any;
  headers: Record<string, string>;
  ipAddress: string;
  status: 'received' | 'processed' | 'failed' | 'retrying';
  deliveryAttempts: number;
  lastError?: string;
  processingTime?: number;
};

type WebhookEndpoint = {
  id: string;
  name: string;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
  createdAt: Date;
  lastTriggeredAt?: Date;
  totalDeliveries: number;
  successRate: number;
};

type WebhookDelivery = {
  id: string;
  webhookId: string;
  eventId: string;
  timestamp: Date;
  status: 'success' | 'failed' | 'pending';
  responseTime: number;
  statusCode: number;
  responseBody?: string;
  retryCount: number;
};

type WebhookStats = {
  totalReceived: number;
  totalDelivered: number;
  totalFailed: number;
  avgResponseTime: number;
  successRate: number;
  eventsBySource: Record<string, number>;
  eventsByType: Record<string, number>;
};

// --- Static Mock Data (No dynamic values) ---
const mockEndpoints: WebhookEndpoint[] = [
  {
    id: 'endpoint_1',
    name: 'Production API',
    url: 'https://api.example.com/webhooks',
    secret: 'whsec_prod_123456',
    events: ['payment_intent.succeeded', 'orders/create', 'push'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    lastTriggeredAt: new Date(),
    totalDeliveries: 15234,
    successRate: 99.2,
  },
  {
    id: 'endpoint_2',
    name: 'Staging Webhook',
    url: 'https://staging-api.example.com/webhooks',
    secret: 'whsec_staging_789012',
    events: ['*'],
    isActive: true,
    createdAt: new Date('2024-01-15'),
    lastTriggeredAt: new Date(),
    totalDeliveries: 3421,
    successRate: 98.5,
  },
  {
    id: 'endpoint_3',
    name: 'Third-Party Service',
    url: 'https://service.partner.com/webhook',
    secret: 'whsec_partner_345678',
    events: ['customer.created', 'customer.updated'],
    isActive: false,
    createdAt: new Date('2024-02-01'),
    lastTriggeredAt: new Date('2024-03-15'),
    totalDeliveries: 892,
    successRate: 95.2,
  },
];

const sourcesList = ['stripe', 'github', 'shopify', 'slack', 'discord', 'twilio', 'sendgrid'];
const eventTypesMap: Record<string, string[]> = {
  stripe: ['payment_intent.succeeded', 'payment_intent.failed', 'customer.created', 'invoice.paid'],
  github: ['push', 'pull_request', 'issues', 'star', 'fork'],
  shopify: ['orders/create', 'orders/update', 'products/create', 'carts/update'],
  slack: ['message', 'channel_created', 'user_joined'],
  discord: ['message_create', 'guild_member_add', 'channel_update'],
  twilio: ['sms_received', 'call_completed', 'status_callback'],
  sendgrid: ['delivery', 'open', 'click', 'bounce'],
};

// --- Helper Functions ---
const calculateStats = (events: WebhookEvent[], deliveries: WebhookDelivery[]): WebhookStats => {
  const delivered = deliveries.filter(d => d.status === 'success').length;
  const failed = deliveries.filter(d => d.status === 'failed').length;
  const avgResponseTime = deliveries.length > 0 
    ? Math.round(deliveries.reduce((sum, d) => sum + d.responseTime, 0) / deliveries.length)
    : 0;
  
  const eventsBySource: Record<string, number> = {};
  const eventsByType: Record<string, number> = {};
  
  events.forEach(event => {
    eventsBySource[event.source] = (eventsBySource[event.source] || 0) + 1;
    eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1;
  });
  
  return {
    totalReceived: events.length,
    totalDelivered: delivered,
    totalFailed: failed,
    avgResponseTime,
    successRate: deliveries.length > 0 ? (delivered / deliveries.length) * 100 : 100,
    eventsBySource,
    eventsByType,
  };
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'success': return 'bg-green-100 text-green-800';
    case 'failed': return 'bg-red-100 text-red-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'received': return 'bg-blue-100 text-blue-800';
    case 'processed': return 'bg-purple-100 text-purple-800';
    case 'retrying': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatJson = (obj: any): string => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
};

// --- UI Components ---
const StatCard = ({ title, value, unit = '', icon }: { title: string; value: string | number; unit?: string; icon: string }) => (
  <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-500">{title}</span>
      <span className="text-2xl">{icon}</span>
    </div>
    <div className="flex items-baseline">
      <span className="text-2xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</span>
      {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
    </div>
  </div>
);

const EventDetailModal = ({ event, onClose }: { event: WebhookEvent | null; onClose: () => void }) => {
  if (!event) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Webhook Event Details</h3>
            <p className="text-sm text-gray-500">{event.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase">Source</label>
              <p className="font-semibold">{event.source}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Event Type</label>
              <p className="font-mono text-sm">{event.eventType}</p>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Status</label>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase">Timestamp</label>
              <p className="text-sm">{event.timestamp.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase">Delivery Attempts</label>
              <p>{event.deliveryAttempts}</p>
            </div>
            {event.processingTime && (
              <div>
                <label className="text-xs text-gray-500 uppercase">Processing Time</label>
                <p>{event.processingTime}ms</p>
              </div>
            )}
          </div>
          
          <div>
            <label className="text-xs text-gray-500 uppercase">Headers</label>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto mt-1">
              {formatJson(event.headers)}
            </pre>
          </div>
          
          <div>
            <label className="text-xs text-gray-500 uppercase">Payload</label>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto mt-1">
              {formatJson(event.payload)}
            </pre>
          </div>
          
          {event.lastError && (
            <div>
              <label className="text-xs text-gray-500 uppercase">Error</label>
              <div className="bg-red-50 text-red-800 p-3 rounded text-sm mt-1">{event.lastError}</div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
            <div>
              <label className="text-xs text-gray-500 uppercase">IP Address</label>
              <p className="text-sm font-mono">{event.ipAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
export default function WebhookMonitorPage() {
  const [mounted, setMounted] = useState(false);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [endpoints] = useState<WebhookEndpoint[]>(mockEndpoints);
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const eventsEndRef = useRef<HTMLDivElement>(null);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);
  const eventCounter = useRef<number>(0);
  const deliveryCounter = useRef<number>(0);

  // Set mounted to true after initial render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate mock webhook event (only called on client after mounted)
  const generateMockWebhookEvent = useCallback((): WebhookEvent => {
    const source = sourcesList[Math.floor(Math.random() * sourcesList.length)];
    const eventTypeList = eventTypesMap[source] || ['unknown'];
    const eventType = eventTypeList[Math.floor(Math.random() * eventTypeList.length)];
    eventCounter.current += 1;
    
    return {
      id: `evt_${Date.now()}_${eventCounter.current}`,
      timestamp: new Date(),
      source,
      eventType,
      payload: {
        id: `payload_${eventCounter.current}`,
        object: eventType.split('.')[0],
        created: Math.floor(Date.now() / 1000),
        data: { example: 'webhook payload data' },
      },
      headers: {
        'user-agent': `${source}-webhook/1.0`,
        'content-type': 'application/json',
        'x-signature': `sha256_mock_${eventCounter.current}`,
      },
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      status: 'received',
      deliveryAttempts: 0,
    };
  }, []);

  // Simulate incoming webhooks
  const startSimulation = useCallback(() => {
    if (simulationInterval.current || !mounted) return;
    
    setIsSimulating(true);
    simulationInterval.current = setInterval(() => {
      const newEvent = generateMockWebhookEvent();
      const randomEndpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
      deliveryCounter.current += 1;
      
      const isSuccess = Math.random() > 0.2;
      const newDelivery: WebhookDelivery = {
        id: `del_${Date.now()}_${deliveryCounter.current}`,
        webhookId: randomEndpoint.id,
        eventId: newEvent.id,
        timestamp: new Date(),
        status: isSuccess ? 'success' : 'failed',
        responseTime: Math.floor(Math.random() * 500) + 50,
        statusCode: isSuccess ? 200 : 500,
        responseBody: isSuccess ? '{"status":"ok"}' : '{"error":"Internal server error"}',
        retryCount: 0,
      };
      
      const processedEvent: WebhookEvent = {
        ...newEvent,
        status: newDelivery.status === 'success' ? 'processed' : 'failed',
        deliveryAttempts: 1,
        processingTime: newDelivery.responseTime,
        lastError: newDelivery.status === 'failed' ? newDelivery.responseBody : undefined,
      };
      
      setEvents((prevEvents: WebhookEvent[]) => {
        const newEvents = [processedEvent, ...prevEvents];
        return newEvents.slice(0, 200);
      });
      
      setDeliveries((prevDeliveries: WebhookDelivery[]) => {
        const newDeliveries = [newDelivery, ...prevDeliveries];
        return newDeliveries.slice(0, 200);
      });
    }, 3000);
  }, [endpoints, generateMockWebhookEvent, mounted]);

  const stopSimulation = useCallback(() => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
      simulationInterval.current = null;
    }
    setIsSimulating(false);
  }, []);

  // Update stats when events/deliveries change
  useEffect(() => {
    if (mounted) {
      setStats(calculateStats(events, deliveries));
    }
  }, [events, deliveries, mounted]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && mounted && eventsEndRef.current) {
      eventsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events, autoScroll, mounted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, []);

  const retryWebhook = useCallback((eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    deliveryCounter.current += 1;
    const isSuccess = Math.random() > 0.3;
    const newDelivery: WebhookDelivery = {
      id: `del_${Date.now()}_${deliveryCounter.current}`,
      webhookId: endpoints[0].id,
      eventId: event.id,
      timestamp: new Date(),
      status: isSuccess ? 'success' : 'failed',
      responseTime: Math.floor(Math.random() * 300) + 50,
      statusCode: isSuccess ? 200 : 500,
      responseBody: isSuccess ? '{"status":"ok"}' : '{"error":"Retry failed"}',
      retryCount: event.deliveryAttempts + 1,
    };
    
    setDeliveries((prevDeliveries: WebhookDelivery[]) => {
      const newDeliveries = [newDelivery, ...prevDeliveries];
      return newDeliveries.slice(0, 200);
    });
    
    setEvents((prevEvents: WebhookEvent[]) => {
      return prevEvents.map(e => 
        e.id === eventId 
          ? { 
              ...e, 
              status: newDelivery.status === 'success' ? 'processed' : 'failed',
              deliveryAttempts: e.deliveryAttempts + 1,
              lastError: newDelivery.status === 'failed' ? newDelivery.responseBody : undefined,
            }
          : e
      );
    });
  }, [events, endpoints]);

  const clearLogs = useCallback(() => {
    if (confirm('Are you sure you want to clear all webhook events and deliveries?')) {
      setEvents([]);
      setDeliveries([]);
      eventCounter.current = 0;
      deliveryCounter.current = 0;
    }
  }, []);

  const filteredEvents = events.filter(event => {
    if (filterSource !== 'all' && event.source !== filterSource) return false;
    if (filterStatus !== 'all' && event.status !== filterStatus) return false;
    return true;
  });

  const uniqueSources = Array.from(new Set(events.map(e => e.source)));

  // Show loading state during SSR or before hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
              🔗 Webhook Monitor
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Loading webhook monitor...
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-gray-400">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">
            🔗 Webhook Monitor
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time webhook monitoring, delivery tracking, and debugging dashboard
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <StatCard title="Total Received" value={stats.totalReceived} icon="📥" />
            <StatCard title="Delivered" value={stats.totalDelivered} icon="✅" />
            <StatCard title="Failed" value={stats.totalFailed} icon="❌" />
            <StatCard title="Avg Response" value={stats.avgResponseTime} unit="ms" icon="⚡" />
            <StatCard title="Success Rate" value={stats.successRate.toFixed(1)} unit="%" icon="📈" />
          </div>
        )}

        {/* Control Bar */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">🎮 Webhook Simulator</h2>
                <p className="text-sm text-gray-600">Simulate incoming webhooks from various sources</p>
              </div>
              <div className="flex gap-3">
                {!isSimulating ? (
                  <button
                    onClick={startSimulation}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
                  >
                    ▶ Start Simulation
                  </button>
                ) : (
                  <button
                    onClick={stopSimulation}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition"
                  >
                    ⏹ Stop Simulation
                  </button>
                )}
                <button
                  onClick={clearLogs}
                  disabled={events.length === 0}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🗑 Clear Logs
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Source:</label>
              <select
                value={filterSource}
                onChange={e => setFilterSource(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Sources</option>
                {uniqueSources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">Status:</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="received">Received</option>
                <option value="processed">Processed</option>
                <option value="failed">Failed</option>
                <option value="retrying">Retrying</option>
              </select>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-600">Auto-scroll</span>
              <button
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                  autoScroll ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {autoScroll ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Endpoints Overview */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">📡 Active Webhook Endpoints</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {endpoints.map(endpoint => (
              <div key={endpoint.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{endpoint.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${endpoint.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {endpoint.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs font-mono text-gray-500 mb-2 truncate">{endpoint.url}</p>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Deliveries: {endpoint.totalDeliveries.toLocaleString()}</span>
                  <span className="text-green-600">Success: {endpoint.successRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">📨 Webhook Events</h2>
              <p className="text-sm text-gray-500">Showing {filteredEvents.length} of {events.length} events</p>
            </div>
          </div>
          
          <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attempts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No webhook events received yet. Start the simulator to see events.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {event.timestamp.toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          {event.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-800">{event.eventType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.deliveryAttempts}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {event.processingTime ? `${event.processingTime}ms` : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View
                          </button>
                          {event.status === 'failed' && (
                            <button
                              onClick={() => retryWebhook(event.id)}
                              className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                            >
                              Retry
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div ref={eventsEndRef} />
          </div>
        </div>

        {/* Recent Deliveries Section */}
        {deliveries.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">📤 Recent Deliveries</h3>
            </div>
            <div className="p-4 space-y-2 max-h-64 overflow-y-auto">
              {deliveries.slice(0, 10).map(delivery => (
                <div key={delivery.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${delivery.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-sm font-mono">{delivery.eventId.slice(0, 12)}...</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(delivery.status)}`}>
                      {delivery.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{delivery.responseTime}ms</span>
                    <span>{delivery.statusCode}</span>
                    <span>{delivery.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats by Source */}
        {stats && Object.keys(stats.eventsBySource).length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-3">📊 Events by Source</h3>
              <div className="space-y-2">
                {Object.entries(stats.eventsBySource).map(([source, count]) => (
                  <div key={source} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{source}</span>
                    <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: stats.totalReceived > 0 ? `${(count / stats.totalReceived) * 100}%` : '0%' }}
                      />
                    </div>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-3">💡 Webhook Best Practices</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Always verify webhook signatures</li>
                <li>✓ Implement idempotency keys</li>
                <li>✓ Use retry with exponential backoff</li>
                <li>✓ Monitor delivery latency</li>
                <li>✓ Keep webhook endpoints idempotent</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}