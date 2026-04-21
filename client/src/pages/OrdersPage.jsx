import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import OrderKanban from '../components/OrderKanban';

const OrdersPage = () => {
  const { shopId } = useParams();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar shopName="Orders" shopColor="#334155" />

      <main className="flex-1 ml-56 p-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order Fulfillment Pipeline</h1>
          <p className="text-gray-400 text-sm">Move orders through pending, processing, shipped, and delivered.</p>
        </header>

        <OrderKanban shopId={shopId} />
      </main>
    </div>
  );
};

export default OrdersPage;
