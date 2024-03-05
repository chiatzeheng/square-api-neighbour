import GlobalMapView from '@/components/Map';
import { useQuery } from '@tanstack/react-query'
import axios from "axios"
import BottomDraggableDrawer from "@/components/BottomDraggableDrawer"



const Dashboard = () => {

    // const { isLoading, error, data } = useQuery({
    //     queryKey: ['repoData'],
    //     queryFn: () =>
    //       axios.get('').then((res) =>
    //         res.json(),
    //       ),
    //   })
    
    //   if (isLoading) return 'Loading...'
    
    //   if (error) return 'An error has occurred: ' + error.message



  return (
    <>
         <GlobalMapView/>
         <BottomDraggableDrawer/>
    </>
 
  );
};



export default Dashboard;
