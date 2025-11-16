import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function EditForm({ resumeData, setResumeData }: any) {
  const updateField = (field: string, value: any) => {
    setResumeData({ ...resumeData, [field]: value });
  };

  const updateArrayItem = (field: string, index: number, key: string, value: string) => {
    const updated = [...resumeData[field]];
    updated[index] = { ...updated[index], [key]: value };
    updateField(field, updated);
  };

  const addArrayItem = (field: string, template: any) => {
    setResumeData({
      ...resumeData,
      [field]: [...resumeData[field], template]
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    setResumeData({
      ...resumeData,
      [field]: resumeData[field].filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <div className="p-6 space-y-8">
      {/* Personal Info */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-blue-400">Personal Info</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full Name"
            value={resumeData.full_name}
            onChange={e => updateField('full_name', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={resumeData.email}
            onChange={e => updateField('email', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Phone"
            value={resumeData.phone_number}
            onChange={e => updateField('phone_number', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="Location"
            value={resumeData.location}
            onChange={e => updateField('location', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none"
          />
          <input
            type="text"
            placeholder="LinkedIn URL"
            value={resumeData.linkedin_url}
            onChange={e => updateField('linkedin_url', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none text-sm"
          />
          <input
            type="text"
            placeholder="GitHub URL"
            value={resumeData.github_link}
            onChange={e => updateField('github_link', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none text-sm"
          />
          <input
            type="text"
            placeholder="LeetCode URL"
            value={resumeData.leetcode_link}
            onChange={e => updateField('leetcode_link', e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none text-sm"
          />
          <textarea
            placeholder="Summary"
            value={resumeData.summary}
            onChange={e => updateField('summary', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 outline-none text-sm"
          />
        </div>
      </section>

      {/* Education */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-blue-400">Education</h2>
          <button
            onClick={() => addArrayItem('education', {
              university: '', location: '', degree: '', date: '', courses: []
            })}
            className="p-1 bg-green-700 hover:bg-green-600 rounded"
          >
            <Plus size={16} />
          </button>
        </div>
        {resumeData.education.map((edu: any, i: number) => (
          <div key={i} className="mb-4 p-3 bg-slate-700 rounded space-y-2">
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree}
              onChange={e => updateArrayItem('education', i, 'degree', e.target.value)}
              className="w-full px-2 py-1 bg-slate-600 rounded border border-slate-500 text-sm"
            />
            <input
              type="text"
              placeholder="University"
              value={edu.university}
              onChange={e => updateArrayItem('education', i, 'university', e.target.value)}
              className="w-full px-2 py-1 bg-slate-600 rounded border border-slate-500 text-sm"
            />
            <input
              type="text"
              placeholder="Location"
              value={edu.location}
              onChange={e => updateArrayItem('education', i, 'location', e.target.value)}
              className="w-full px-2 py-1 bg-slate-600 rounded border border-slate-500 text-sm"
            />
            <input
              type="text"
              placeholder="Date"
              value={edu.date}
              onChange={e => updateArrayItem('education', i, 'date', e.target.value)}
              className="w-full px-2 py-1 bg-slate-600 rounded border border-slate-500 text-sm"
            />
            <button
              onClick={() => removeArrayItem('education', i)}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-blue-400">Experience</h2>
          <button
            onClick={() => addArrayItem('experience', {
              title: '', company: '', location: '', date: '', description: []
            })}
            className="p-1 bg-green-700 hover:bg-green-600 rounded"
          >
            <Plus size={16} />
          </button>
        </div>
        {resumeData.experience.map((exp: any, i: number) => (
          <div key={i} className="mb-4 p-3 bg-slate-700 rounded space-y-2">
            <input
              type="text"
              placeholder="Title"
              value={exp.title}
              onChange={e => updateArrayItem('experience', i, 'title', e.target.value)}
              className="w-full px-2 py-1 bg-slate-600 rounded border border-slate-500 text-sm"
            />
            <input
              type="text"
              placeholder="Company"
              value={exp.company}
              onChange={e => updateArrayItem('experience', i, 'company', e.target.value)}
              className="w-full px-2 py-1 bg-slate-600 rounded border border-slate-500 text-sm"
            />
            <input
              type="text"
              placeholder="Location"
              value={exp.location}
              onChange={e => updateArrayItem('experience', i, 'location', e.target.value)}
              className="w-full px-2 py-1 bg-slate-600 rounded border border-slate-500 text-sm"
            />
            <input
              type="text"
              placeholder="Date"
              value={exp.date}
              onChange={e => updateArrayItem('experience', i, 'date', e.target.value)}
              className="w-full px-2 py-1 bg-slate-600 rounded border border-slate-500 text-sm"
            />
            <textarea
              placeholder="Description (one per line)"
              value={Array.isArray(exp.description) ? exp.description.join("\n") : exp.description}
              onChange={e => updateArrayItem('experience', i, 'description', e.target.value)}
              rows={2}
              className="w-full px-2 py-1 bg-slate-600 rounded border border-slate-500 text-sm"
            />
            <button
              onClick={() => removeArrayItem('experience', i)}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        ))}
      </section>

      {/* Skills */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-blue-400">Skills</h2>
          <button
            onClick={() => addArrayItem('skills', { name: '', value: '' })}
            className="p-1 bg-green-700 hover:bg-green-600 rounded"
          >
            <Plus size={16} />
          </button>
        </div>
        {resumeData.skills.map((skill: any, i: number) => (
          <div key={i} className="mb-4 p-3 bg-slate-700 rounded space-y-2">
            <input
              type="text"
              placeholder="Category"
              value={skill.name}
              onChange={e => updateArrayItem('skills', i, 'name', e.target.value)}
              className="w-full px-2 py-1 bg-slate-600 rounded border border-slate-500 text-sm"
            />
            <textarea
              placeholder="Skills (comma-separated)"
              value={skill.value}
              onChange={e => updateArrayItem('skills', i, 'value', e.target.value)}
              rows={2}
              className="w-full px-2 py-1 bg-slate-600 rounded border border-slate-500 text-sm"
            />
            <button
              onClick={() => removeArrayItem('skills', i)}
              className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}