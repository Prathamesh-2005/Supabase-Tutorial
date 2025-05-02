import supabase from '../config/supabaseClient';
import { useEffect, useState } from 'react';

// components
import SmoothieCard from '../components/SmoothieCard';

const Home = () => {
  const [fetchError, setFetchError] = useState(null);
  const [smoothies, setSmoothies] = useState([]);
  const [orderBy, setOrderBy] = useState('created_at');


  const handleDelete = async (id) => {
    try {
      console.log('Deleting smoothie with id:', id); // Debugging
      if (!window.confirm('Are you sure you want to delete this smoothie?')) {
        return;
      }

      const { error } = await supabase
        .from('smoothies')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Error deleting smoothie: ${error.message}`);
      }

      // Refetch smoothies after deletion
      const { data, error: fetchError } = await supabase
        .from('smoothies')
        .select();

      if (fetchError) {
        throw new Error(`Error refetching smoothies: ${fetchError.message}`);
      }

      setSmoothies(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const fetchSmoothies = async () => {
      const { data, error } = await supabase
        .from('smoothies')
        .select()
        .order(orderBy, { ascending: false });

      if (error) {
        setFetchError('Could not fetch the smoothies');
        setSmoothies([]);
      }
      if (data) {
        setSmoothies(data);
        setFetchError(null);
      }
    };

    fetchSmoothies();
  }, [orderBy]);

  return (
    <div className="page home">
      {fetchError && <p>{fetchError}</p>}
      {smoothies && (
        <div className="smoothies">
           <div className="order-by">
            <p>Order by:</p>
            <button onClick={() => setOrderBy('created_at')}>Time Created</button>
            <button onClick={() => setOrderBy('title')}>Title</button>
            <button onClick={() => setOrderBy('rating')}>Rating</button>
            {orderBy}
          </div>
          <div className="smoothie-grid">
            {smoothies.map((smoothie) => (
              <SmoothieCard
                key={smoothie.id}
                smoothie={smoothie}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;