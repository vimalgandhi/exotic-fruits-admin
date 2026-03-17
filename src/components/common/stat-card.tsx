interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard = ({ title, value }: StatCardProps) => {
  return <div className='stat-card'>{title}: {value}</div>;
};
export default StatCard;
