import SidebarContent from './SidebarContent';
import SidebarFooter from './SidebarFooter';
import SidebarHeader from './SidebarHeader';

const Sidebar = () => {
  return (
    <div className='h-screen basis-2/12 dark:bg-zinc-900 shadow-md border-r border-r-zinc-800 flex flex-col'>
      <SidebarHeader />
      <SidebarContent />
      <SidebarFooter />
    </div>
  );
};

export default Sidebar;
