import { MobileSidebar } from "@/components/mobile-sidebar";

const Navbar = async () => {

  
  return ( 
    <div className="flex items-center p-4">
      <MobileSidebar isPro={false} apiLimitCount={10} />
    </div>
   );
}
 
export default Navbar;