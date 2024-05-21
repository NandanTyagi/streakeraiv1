import StandardButton from "./StandardButton";

const ButtonGroup = () => {
  return (
    <div className="flex justify-between items-center gap-x-4">
      <div>
        <StandardButton text="Track" type="round" />
      </div>
      <div>
        <StandardButton text="Identify" type="round" />
      </div>
      <div>
        <StandardButton text="Join" type="round" />
      </div>
    </div>
  );
};

export default ButtonGroup;
