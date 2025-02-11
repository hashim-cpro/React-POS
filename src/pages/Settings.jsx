import ThemeToggle from "../components/ThemeToggle";

function Settings() {
  return (
    <div className="space-y-6">
      <div className="bg-secondary rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Settings</h2>
        <div className="space-y-6">
          <ThemeToggle />
          {/* Add other settings sections here */}
        </div>
      </div>
    </div>
  );
}

export default Settings;
