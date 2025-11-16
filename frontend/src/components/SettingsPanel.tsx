export default function SettingsPanel({
  fontSize,
  setFontSize,
  margins,
  setMargins,
  oneLineEducation,
  setOneLineEducation
}: any) {
  const updateMargin = (key: string, value: number) => {
    setMargins({ ...margins, [key]: value });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-bold text-blue-400">Formatting</h2>

      <div>
        <label className="block text-sm font-medium mb-2">Font Size: {fontSize}pt</label>
        <input
          type="range"
          min="9"
          max="14"
          value={fontSize}
          onChange={e => setFontSize(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Top Margin: {margins.top.toFixed(2)}"</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={margins.top}
          onChange={e => updateMargin('top', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bottom Margin: {margins.bottom.toFixed(2)}"</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={margins.bottom}
          onChange={e => updateMargin('bottom', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Left Margin: {margins.left.toFixed(2)}"</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={margins.left}
          onChange={e => updateMargin('left', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Right Margin: {margins.right.toFixed(2)}"</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={margins.right}
          onChange={e => updateMargin('right', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={oneLineEducation}
          onChange={e => setOneLineEducation(e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-sm">One-line Education</span>
      </label>
    </div>
  );
}