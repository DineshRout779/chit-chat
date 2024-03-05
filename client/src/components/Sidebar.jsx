import SidebarContent from './SidebarContent';
import SidebarFooter from './SidebarFooter';
import SidebarHeader from './SidebarHeader';

const Sidebar = () => {
  return (
    <div className='h-screen basis-2/12  bg-white/75 dark:bg-black/75 backdrop-blur-md shadow-md border-r border-gray-200 dark:border-r-zinc-800 flex flex-col'>
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
    </div>
  );
};

export default Sidebar;
