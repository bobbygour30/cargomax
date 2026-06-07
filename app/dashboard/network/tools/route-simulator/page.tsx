'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Truck, MapPin, Clock } from 'lucide-react';

interface SimulatedRoute {
  id: string;
  routeCode: string;
  from: string;
  to: string;
  vehicleNumber: string;
  status: 'Running' | 'Completed' | 'Stopped';
  progress: number; // 0 to 100
  currentSpeed: number;
  distanceCovered: number;
  totalDistance: number;
  eta: string;
}

const initialRoutes: SimulatedRoute[] = [
  {
    id: '1',
    routeCode: 'PTR-PAT-001',
    from: 'Patna Mother Hub',
    to: 'Madhubani Spoke',
    vehicleNumber: 'BR01AB1234',
    status: 'Running',
    progress: 45,
    currentSpeed: 62,
    distanceCovered: 65,
    totalDistance: 132,
    eta: '2h 15m',
  },
  {
    id: '2',
    routeCode: 'PTR-PAT-002',
    from: 'Patna Mother Hub',
    to: 'Darbhanga Spoke',
    vehicleNumber: 'BR01CD5678',
    status: 'Running',
    progress: 72,
    currentSpeed: 58,
    distanceCovered: 78,
    totalDistance: 108,
    eta: '1h 05m',
  },
  {
    id: '3',
    routeCode: 'RAN-DHN-001',
    from: 'Ranchi Regional Hub',
    to: 'Dhanbad Spoke',
    vehicleNumber: 'JH05XY9012',
    status: 'Stopped',
    progress: 30,
    currentSpeed: 0,
    distanceCovered: 45,
    totalDistance: 155,
    eta: '4h 20m',
  },
];

export default function RouteSimulatorPage() {
  const [routes, setRoutes] = useState<SimulatedRoute[]>(initialRoutes);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x, 2x, 3x

  // Live Simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isSimulating) {
      interval = setInterval(() => {
        setRoutes(prev => prev.map(route => {
          if (route.status === 'Running') {
            const newProgress = Math.min(100, route.progress + (0.8 * simulationSpeed));
            
            return {
              ...route,
              progress: newProgress,
              currentSpeed: newProgress < 100 ? Math.floor(45 + Math.random() * 35) : 0,
              distanceCovered: Math.floor(route.totalDistance * (newProgress / 100)),
              status: newProgress >= 100 ? 'Completed' : 'Running',
              eta: newProgress >= 100 ? 'Arrived' : `${Math.floor((100 - newProgress) / 8)}m`,
            };
          }
          return route;
        }));
      }, 800);
    }

    return () => clearInterval(interval);
  }, [isSimulating, simulationSpeed]);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setRoutes(initialRoutes);
  };

  const completedCount = routes.filter(r => r.status === 'Completed').length;

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Route Simulator</h1>
          <p className="text-gray-600 mt-1">Real-time route simulation and performance visualization</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={toggleSimulation}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-all
              ${isSimulating ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {isSimulating ? <Pause size={20} /> : <Play size={20} />}
            {isSimulating ? 'Pause Simulation' : 'Start Simulation'}
          </button>

          <button
            onClick={resetSimulation}
            className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-6 py-3 rounded-xl font-medium"
          >
            <RotateCcw size={20} />
            Reset
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border mb-8 flex items-center gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Simulation Speed</label>
          <div className="flex gap-2">
            {[1, 2, 3].map(speed => (
              <button
                key={speed}
                onClick={() => setSimulationSpeed(speed)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition-all
                  ${simulationSpeed === speed ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto text-sm text-gray-500">
          {isSimulating ? '🚛 Simulation Running...' : 'Simulation Paused'}
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {routes.map((route) => (
          <div key={route.id} className="bg-white rounded-3xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono font-semibold text-lg">{route.routeCode}</p>
                  <p className="text-sm text-gray-500">{route.from} → {route.to}</p>
                </div>
                <span className={`px-4 py-1 rounded-full text-xs font-medium
                  ${route.status === 'Running' ? 'bg-blue-100 text-blue-700' : ''}
                  ${route.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : ''}
                  ${route.status === 'Stopped' ? 'bg-gray-100 text-gray-700' : ''}`}>
                  {route.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span className="font-medium">{route.progress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                    style={{ width: `${route.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="text-gray-500">Vehicle</p>
                  <p className="font-mono font-medium">{route.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Current Speed</p>
                  <p className="font-medium">{route.currentSpeed} km/h</p>
                </div>
                <div>
                  <p className="text-gray-500">Distance Covered</p>
                  <p className="font-medium">{route.distanceCovered} / {route.totalDistance} km</p>
                </div>
                <div>
                  <p className="text-gray-500">ETA</p>
                  <p className="font-medium text-emerald-600">{route.eta}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm border">
        <h3 className="text-xl font-semibold mb-6">Simulation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-gray-500">Routes Running</p>
            <p className="text-5xl font-bold mt-2">{routes.filter(r => r.status === 'Running').length}</p>
          </div>
          <div>
            <p className="text-gray-500">Total Distance Covered</p>
            <p className="text-5xl font-bold mt-2">
              {routes.reduce((sum, r) => sum + r.distanceCovered, 0)} km
            </p>
          </div>
          <div>
            <p className="text-gray-500">Completed Routes</p>
            <p className="text-5xl font-bold mt-2 text-emerald-600">{completedCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}