"use client";

import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";

// ✅ Table Extensions
import {TableKit} from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table as UITable,
  TableBody,
  TableCell as UICell,
  TableHead,
  TableHeader as UIHeader,
  TableRow as UIRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Save,
  RefreshCw,
  Search,
  Pencil,
  Trash2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* =========================
   TYPES
========================= */

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  fromAddress: string;
  fromName: string;
  toAddress: string;
  toName: string;
  senderMailId: string;
  body: string;
}

/* =========================
   MOCK DATA
========================= */

const mockTemplates: EmailTemplate[] = [
  {
    id: 1,
    name: "ARRIVAL EMAIL TEMPLATE",
    subject: "MANIFEST ARRIVED",
    fromAddress: "noreply@test.com",
    fromName: "System",
    toAddress: "customer@test.com",
    toName: "Customer",
    senderMailId: "system@test.com",
    body: "<p>Your consignment has arrived.</p>",
  },
];

/* =========================
   TOOLBAR
========================= */

const Toolbar = ({ editor }: any) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 border-b p-2 bg-muted/30">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className="p-2 border rounded"
      >
        <Bold className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className="p-2 border rounded"
      >
        <Italic className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className="p-2 border rounded"
      >
        <UnderlineIcon className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().setTextAlign("left").run()
        }
        className="p-2 border rounded"
      >
        <AlignLeft className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().setTextAlign("center").run()
        }
        className="p-2 border rounded"
      >
        <AlignCenter className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().setTextAlign("right").run()
        }
        className="p-2 border rounded"
      >
        <AlignRight className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleBulletList().run()
        }
        className="p-2 border rounded"
      >
        <List className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() =>
          editor.chain().focus().toggleOrderedList().run()
        }
        className="p-2 border rounded"
      >
        <ListOrdered className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => {
          const url = prompt("Enter URL");

          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className="p-2 border rounded"
      >
        <LinkIcon className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => {
          const url = prompt("Enter Image URL");

          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="p-2 border rounded"
      >
        <ImageIcon className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({
              rows: 3,
              cols: 3,
              withHeaderRow: true,
            })
            .run()
        }
        className="p-2 border rounded"
      >
        <TableIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

/* =========================
   MAIN COMPONENT
========================= */

export default function EmailTemplateMaster() {
  const [activeTab, setActiveTab] = useState<
    "entry" | "search"
  >("entry");

  const [templates, setTemplates] =
    useState<EmailTemplate[]>(mockTemplates);

  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState<number | null>(null);

  // Form States
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [fromName, setFromName] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [toName, setToName] = useState("");
  const [senderMailId, setSenderMailId] = useState("");

  /* =========================
     TIPTAP EDITOR
  ========================= */

  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

      Underline,

      Highlight,

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),

      Link.configure({
        openOnClick: false,
      }),

      Image,

      // ✅ TABLE
    //   TableKit.configure({
    //     // resizable: true,
    //   }),

      TableRow,
      TableHeader,
      TableCell,

      Placeholder.configure({
        placeholder: "Write email content here...",
      }),
    ],

    content: "",
  });

  /* =========================
     RESET FORM
  ========================= */

  const resetForm = () => {
    setEditId(null);

    setName("");
    setSubject("");
    setFromAddress("");
    setFromName("");
    setToAddress("");
    setToName("");
    setSenderMailId("");

    editor?.commands.setContent("");
  };

  /* =========================
     SAVE
  ========================= */

  const handleSave = () => {
    if (!editor) return;

    const body = editor.getHTML();

    if (
      !name ||
      !subject ||
      !fromAddress ||
      !fromName ||
      !toAddress ||
      !toName
    ) {
      alert("Please fill all required fields");
      return;
    }

    const payload: EmailTemplate = {
      id: editId || Date.now(),
      name,
      subject,
      fromAddress,
      fromName,
      toAddress,
      toName,
      senderMailId,
      body,
    };

    if (editId) {
      const updated = templates.map((item) =>
        item.id === editId ? payload : item
      );

      setTemplates(updated);

      alert("Template Updated");
    } else {
      setTemplates([...templates, payload]);

      alert("Template Saved");
    }

    resetForm();

    setActiveTab("search");
  };

  /* =========================
     EDIT
  ========================= */

  const handleEdit = (item: EmailTemplate) => {
    setEditId(item.id);

    setName(item.name);
    setSubject(item.subject);
    setFromAddress(item.fromAddress);
    setFromName(item.fromName);
    setToAddress(item.toAddress);
    setToName(item.toName);
    setSenderMailId(item.senderMailId);

    editor?.commands.setContent(item.body);

    setActiveTab("entry");
  };

  /* =========================
     DELETE
  ========================= */

  const handleDelete = (id: number) => {
    const filtered = templates.filter(
      (item) => item.id !== id
    );

    setTemplates(filtered);

    alert("Deleted Successfully");
  };

  /* =========================
     FILTER
  ========================= */

  const filteredTemplates = templates.filter(
    (item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.subject
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      {/* HEADER */}
      <div className="border-b pb-3">
        <h1 className="text-xl font-bold">
          EMAIL TEMPLATE MASTER
        </h1>

        <p className="text-sm text-muted-foreground mt-1">
          Manage your email templates here
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-3 border-b pb-2">
        <button
          onClick={() => {
            resetForm();
            setActiveTab("entry");
          }}
          className={cn(
            "px-4 py-2 rounded-md text-sm",
            activeTab === "entry"
              ? "bg-primary text-white"
              : "bg-muted"
          )}
        >
          Entry
        </button>

        <button
          onClick={() => setActiveTab("search")}
          className={cn(
            "px-4 py-2 rounded-md text-sm",
            activeTab === "search"
              ? "bg-primary text-white"
              : "bg-muted"
          )}
        >
          Search
        </button>
      </div>

      {/* ENTRY TAB */}
      {activeTab === "entry" && (
        <Card>
          <CardHeader>
            <CardTitle>Email Template Form</CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Name *</Label>

                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label>Subject *</Label>

                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div>
                <Label>From Address *</Label>

                <Input
                  value={fromAddress}
                  onChange={(e) =>
                    setFromAddress(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>From Name *</Label>

                <Input
                  value={fromName}
                  onChange={(e) =>
                    setFromName(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>To Address *</Label>

                <Input
                  value={toAddress}
                  onChange={(e) =>
                    setToAddress(e.target.value)
                  }
                />
              </div>

              <div>
                <Label>To Name *</Label>

                <Input
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                />
              </div>

              <div>
                <Label>Sender Mail Id</Label>

                <Input
                  value={senderMailId}
                  onChange={(e) =>
                    setSenderMailId(e.target.value)
                  }
                />
              </div>
            </div>

            {/* EDITOR */}
            <div>
              <Label>Email Body</Label>

              <div className="border rounded-md overflow-hidden">
                <Toolbar editor={editor} />

                <EditorContent
                  editor={editor}
                  className="min-h-[300px] p-4"
                />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 justify-end">
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {editId ? "UPDATE" : "SAVE"}
              </Button>

              <Button
                variant="outline"
                onClick={resetForm}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                CLEAR
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEARCH TAB */}
      {activeTab === "search" && (
        <div className="space-y-4">
          {/* SEARCH */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4" />

            <Input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* TABLE */}
          <div className="border rounded-md overflow-x-auto">
            <UITable>
              <UIHeader>
                <UIRow>
                  <TableHead>S#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Action</TableHead>
                </UIRow>
              </UIHeader>

              <TableBody>
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((item, index) => (
                    <UIRow key={item.id}>
                      <UICell>{index + 1}</UICell>

                      <UICell>{item.name}</UICell>

                      <UICell>{item.subject}</UICell>

                      <UICell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDelete(item.id)
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </UICell>
                    </UIRow>
                  ))
                ) : (
                  <UIRow>
                    <UICell
                      colSpan={4}
                      className="text-center py-6"
                    >
                      No Templates Found
                    </UICell>
                  </UIRow>
                )}
              </TableBody>
            </UITable>
          </div>
        </div>
      )}
    </div>
  );
}