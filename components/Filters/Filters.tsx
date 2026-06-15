// 1. Імпортуємо функцію
import { getCategories } from '@/lib/api/clientApi';

const Filters = async () => {
  // 3. Виконуємо запит
  const categories = await getCategories();
  console.log('categories', categories);
  return (
    <div>
      Filters
      <p>
        Categories:{' '}
        {categories.data.map(category => (
          <span key={category._id}>{category.name}</span>
        ))}
      </p>
    </div>
  );
};

export default Filters;
