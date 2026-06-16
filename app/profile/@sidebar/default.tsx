// ==========================================================================================
// default.tsx - це файл, який відповідає за відображення сторінки за замовчуванням
// для маршруту /notes/filter/@sidebar.
// ==========================================================================================

// Імпорт компонента Link з Next.js - Для створення посилань
// import Link from 'next/link';

const ProfileSidebar = async () => {
  return null; // Повертаємо null, щоб не відображати нічого на сторінці за замовчуванням

  // return (
  //   <div>
  //     <h3>ProfileSidebar</h3>
  //     <p>Це сторінка за замовчуванням для маршруту /profile/@sidebar.</p>
  //     <ul>
  //       <li>
  //         <Link href={`/profile/own`}>OWN</Link>
  //       </li>
  //       <li>
  //         <Link href={`/profile/favorites`}>FAVORITES</Link>
  //       </li>
  //     </ul>
  //   </div>
  // );
};

export default ProfileSidebar;
