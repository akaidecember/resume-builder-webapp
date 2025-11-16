import React, { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, Trash2, Download, RotateCcw, GripVertical } from 'lucide-react';
import axios from 'axios';
import ResumePreview from './components/ResumePreview';
import EditForm from './components/EditForm';
import SettingsPanel from './components/SettingsPanel';

interface ResumeData {
  full_name: string;
  location: string;
  phone_number: string;
  email: string;
  linkedin_url: string;
  github_link: string;
  leetcode_link: string;
  summary: string;
  education: any[];
  experience: any[];
  projects: any[];
  skills: any[];
  certificates: any[];
}

const SAMPLE_RESUME: ResumeData = {
  full_name: "Anshul Kumar Shandilya",
  location: "Sunnyvale, CA",
  phone_number: "(831) 246-6142",
  email: "akaidecember@gmail.com",
  linkedin_url: "",
  github_link: "",
  leetcode_link: "",
  summary: "Backend Software Engineer with 3+ years of experience designing and scaling distributed systems, high-throughput APIs, and AI-driven backend platforms. Skilled in Python and Java with a focus on performance, fault tolerance, and data-intensive pipelines.",
  education: [
    {
      university: "San Jose State University",
      location: "San Jose, CA",
      degree: "Master of Science, Software Engineering",
      date: "Jan 2022 -- May 2024",
      courses: []
    }
  ],
  experience: [
    {
      title: "Software Engineer",
      company: "KGS Technology Group, Inc",
      location: "Phoenix, AZ",
      date: "Jul 2025 -- Present",
      description: ["Worked on distributed backend services in Python to manage subscription workflows."]
    }
  ],
  projects: [],
  skills: [
    {
      name: "Programming Languages",
      value: "Java, Python, C/C++, TypeScript, JavaScript, Bash, HTML/CSS"
    }
  ],
  certificates: []
};

const AVAILABLE_SECTIONS = ["education", "skills", "experience", "projects", "certificates"];

export default function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(SAMPLE_RESUME);
  const [sectionOrder, setSectionOrder] = useState(["education", "skills", "experience", "projects"]);
  const [fontSize, setFontSize] = useState(11);
  const [margins, setMargins] = useState({ top: 0.30, bottom: 0.30, left: 0.45, right: 0.45 });
  const [oneLineEducation, setOneLineEducation] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = Array.from(sectionOrder);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    setSectionOrder(items);
  };

  const downloadJSON = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "resume.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      const text = await file.text();
      const parsed = JSON.parse(text);
      // Allow either raw resume shape or wrapped under resume_data
      const incomingResume = parsed.resume_data || parsed;
      setResumeData(incomingResume);
      if (Array.isArray(parsed.section_order)) {
        setSectionOrder(parsed.section_order);
      }
    } catch {
      setError("Invalid JSON file. Please provide a valid resume.json export.");
    } finally {
      // Allow re-uploading the same file again later
      e.target.value = "";
    }
  };

  const downloadPDF = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/resume/generate-pdf`;
      const payload = {
        resume_data: resumeData,
        font_size: fontSize,
        margin_top: margins.top,
        margin_bottom: margins.bottom,
        margin_left: margins.left,
        margin_right: margins.right,
        one_line_education: oneLineEducation,
        section_order: sectionOrder
      };

      const response = await axios.post(url, payload, { responseType: 'blob', validateStatus: (s) => s < 500 });

      const contentType = response.headers['content-type'] || '';
      if (contentType.includes('application/pdf')) {
        const pdfBlob = response.data as Blob;
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'resume.pdf';
        link.click();
        URL.revokeObjectURL(pdfUrl);
      } else {
        // Try to parse JSON and handle base64 or error
        const text = await (response.data as Blob).text();
        const json = JSON.parse(text);
        if (json && json.pdf) {
          const binaryString = atob(json.pdf);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
          const blob = new Blob([bytes], { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = 'resume.pdf';
          link.click();
          URL.revokeObjectURL(pdfUrl);
        } else {
          throw new Error(json?.detail || 'Unexpected response from server');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to generate PDF. Check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const resetResume = () => {
    setResumeData(SAMPLE_RESUME);
    setSectionOrder(["education", "skills", "experience", "projects"]);
  };

  const addSection = (section: string) => {
    if (!sectionOrder.includes(section)) {
      setSectionOrder([...sectionOrder, section]);
    }
  };

  const removeSection = (section: string) => {
    setSectionOrder(sectionOrder.filter(s => s !== section));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 py-4 px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Resume Builder</h1>
            <div className="flex gap-3">
              <input
                type="file"
                accept="application/json"
                ref={fileInputRef}
                onChange={importJSON}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition"
              >
                <Download size={18} />
                Import JSON
              </button>
              <button
                onClick={downloadJSON}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                <Download size={18} />
              Export JSON
            </button>
            <button
              onClick={downloadPDF}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg transition"
            >
              <Download size={18} />
              {loading ? "Generating..." : "Download PDF"}
            </button>
            <button
              onClick={resetResume}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
            >
              <RotateCcw size={18} />
              Reset
            </button>
          </div>
        </div>
        {error && (
          <div className="mt-3 p-3 bg-red-900 border border-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex h-screen overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-1/4 bg-slate-800 overflow-y-auto border-r border-slate-700">
          <EditForm resumeData={resumeData} setResumeData={setResumeData} />
        </div>

        {/* Center Panel - Settings & Sections */}
        <div className="w-1/4 bg-slate-700 overflow-y-auto border-r border-slate-600">
          <SettingsPanel
            fontSize={fontSize}
            setFontSize={setFontSize}
            margins={margins}
            setMargins={setMargins}
            oneLineEducation={oneLineEducation}
            setOneLineEducation={setOneLineEducation}
          />

          <div className="p-6 border-t border-slate-600">
            <h3 className="text-lg font-bold mb-4">Section Order</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-2 p-3 rounded-lg border-2 ${
                      snapshot.isDraggingOver
                        ? "border-blue-500 bg-blue-900/20"
                        : "border-slate-600"
                    }`}
                  >
                    {sectionOrder.map((section, index) => (
                      <Draggable key={section} draggableId={section} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center gap-2 p-3 rounded-lg bg-slate-600 ${
                              snapshot.isDragging ? "bg-blue-600 shadow-lg" : ""
                            }`}
                          >
                            <div {...provided.dragHandleProps} className="cursor-grab">
                              <GripVertical size={18} />
                            </div>
                            <span className="flex-1 capitalize font-medium">{section}</span>
                            <button
                              onClick={() => removeSection(section)}
                              className="text-red-400 hover:text-red-300 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Add sections:</p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_SECTIONS.filter(s => !sectionOrder.includes(s)).map(section => (
                  <button
                    key={section}
                    onClick={() => addSection(section)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-sm transition"
                  >
                    <Plus size={14} />
                    {section}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-slate-900 overflow-y-auto">
          <ResumePreview
            resumeData={resumeData}
            sectionOrder={sectionOrder}
            fontSize={fontSize}
            margins={margins}
          />
        </div>
      </div>
    </div>
  );
}
