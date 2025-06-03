import { useState, useEffect } from "react";

const getTodayKey = () => {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
};

export default function ChoreApp() {
  const [children, setChildren] = useState([
    { name: "子どもA", points: 0, logs: {} },
    { name: "子どもB", points: 0, logs: {} }
  ]);
  const [selectedChild, setSelectedChild] = useState(0);
  const [chores, setChores] = useState([
    "食器洗い",
    "洗濯物たたみ",
    "ゴミ出し",
    "部屋の掃除"
  ]);
  const [newChore, setNewChore] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("choreAppGridData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setChildren(parsed.children || []);
      setChores(parsed.chores || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "choreAppGridData",
      JSON.stringify({ children, chores })
    );
  }, [children, chores]);

  const toggleLog = (date, chore) => {
    setChildren(prev => {
      const updated = [...prev];
      const logs = updated[selectedChild].logs;
      logs[date] = logs[date] || {};
      logs[date][chore] = !logs[date][chore];
      return updated;
    });
  };

  const uniqueDates = Array.from(
    new Set(
      children.flatMap(child => Object.keys(child.logs || {}))
    )
  ).sort();

  const child = children[selectedChild];

  return (
    <div className="p-4 max-w-full overflow-x-auto">
      <h1 className="text-xl font-bold mb-4">お手伝い履歴表（{child.name}）</h1>

      <table className="table-auto border-collapse border border-gray-400">
        <thead>
          <tr>
            <th className="border border-gray-400 px-2 py-1">お手伝い</th>
            {uniqueDates.map(date => (
              <th key={date} className="border border-gray-400 px-2 py-1">{date}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chores.map(chore => (
            <tr key={chore}>
              <td className="border border-gray-400 px-2 py-1 font-semibold">{chore}</td>
              {uniqueDates.map(date => (
                <td
                  key={date}
                  className="border border-gray-400 px-2 py-1 text-center cursor-pointer"
                  onClick={() => toggleLog(date, chore)}
                >
                  {child.logs?.[date]?.[chore] ? "✔️" : ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <label className="block font-semibold mb-1">お手伝いを追加</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newChore}
            onChange={e => setNewChore(e.target.value)}
            className="border p-1 rounded w-full"
          />
          <button
            onClick={() => {
              if (newChore.trim() && !chores.includes(newChore)) {
                setChores([...chores, newChore.trim()]);
                setNewChore("");
              }
            }}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  );
}
