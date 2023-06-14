import "./title.css";

const SectionTitle = ({ text }) => {
  return (
    <div className="relative">
      <h2 className="title text-xl font-bold">{text}</h2>
      <div className="underline"></div>
    </div>
  );
};

export default SectionTitle;
