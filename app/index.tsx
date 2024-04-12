import GlobalMapView from '@/components/Map';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


const Dashboard = () => {

    const locations = useQuery({
        queryKey: ["locations"],
        queryFn: async () => {
          try {
            const res = await axios.get(
              `http://${process.env.EXPO_PUBLIC_URL}:8080/fetchLocations`
            );
            return res.data;
           
          } catch (error) {
            console.log(error);
          }
        },
      });
    
      console.log(locations.data)

return (
    <GlobalMapView locations={locations} />
)
}
    
export default Dashboard