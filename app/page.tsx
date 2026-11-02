import catalogue from '@/data/catalogue.json';
import Library from '@/components/library';
export default function Home(){return <Library icons={catalogue.icons} meta={catalogue.meta}/>;}
