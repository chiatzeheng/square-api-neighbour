import GlobalMapView from '@/components/Map';
import axios from "axios";
import { useQuery } from '@tanstack/react-query';

const Dashboard = () => {
  // const { isLoading, error, data } = useQuery({
  //   queryKey: ['businesses'],
  //   queryFn: async () => {
  //     try {
  //       const res = await axios.get(`${process.env.EXPO_PUBLIC_URL}/fetchBusiness`);
  //       return res.data;
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // })

  return <GlobalMapView />;
};

export default Dashboard;