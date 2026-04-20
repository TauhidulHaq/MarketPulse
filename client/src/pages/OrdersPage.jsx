import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import OrderKanban from '../components/OrderKanban';

const OrdersPage = () => {
  const { shopId } = useParams();

  return (
    <div className="p-6">
      <div className="flex gap-6">
        <Sidebar />
        <main className="flex-1">
          <h2 className="text-xl font-bold mb-4">Orders</h2>
          <OrderKanban shopId={shopId} />
        </main>
      </div>
    </div>
  );
};

export default OrdersPage;
