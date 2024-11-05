import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', path: '/' },
    { name: 'Sales', path: '/sales' },
    { name: 'Inventory', path: '/inventory' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-4">
        <h2 className="text-xl font-bold">POS System</h2>
      </div>
      <nav className="mt-4">
        {navigation.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
              location.pathname === item.path ? 'bg-gray-100' : ''
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export default Sidebar;