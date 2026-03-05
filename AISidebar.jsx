export default function AISidebar({ activeItem, onItemClick }) {
  const sections = [
    {
      label: "AI Modules",
      items: [
        { id: "predictive", icon: "🔮", name: "Predictive Analytics" },
        { id: "flow", icon: "🌊", name: "Flow Discovery" },
        { id: "testgen", icon: "🧪", name: "Test Generation" },
        { id: "sentiment", icon: "💬", name: "Sentiment Analysis" },
        { id: "preventive", icon: "🛡️", name: "Preventive Tests" },
        { id: "quality", icon: "📊", name: "Quality Score" },
      ]
    },
    {
      label: "Reports",
      items: [
        { id: "weekly", icon: "📅", name: "Weekly Report" },
        { id: "trends", icon: "📈", name: "Trend Analysis" },
        { id: "ranking", icon: "🏆", name: "Team Ranking" },
      ]
    },
    {
      label: "Settings",
      items: [
        { id: "apikeys", icon: "🔑", name: "AI API Keys" },
        { id: "config", icon: "⚙️", name: "Model Config" },
        { id: "alerts", icon: "🔔", name: "Alert Rules" },
      ]
    }
  ];

  return (
    <aside className="sidebar">
      {sections.map((section, si) => (
        <div key={si} className="sidebar-section">
          <div className="sidebar-label">{section.label}</div>
          {section.items.map((item, i) => (
            <div 
              key={i} 
              className={`sidebar-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => onItemClick?.(item.id)}
            >
              {item.icon} {item.name}
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}
