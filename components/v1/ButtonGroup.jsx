import StandardButton from "./StandardButton";

const ButtonGroup = ({ track = true, identify = true, join = true }) => {
  return (
    <div className="flex justify-between items-center gap-x-4 mt-4">
      {track && (
        <div>
          <StandardButton text="Track" type="round" />
        </div>
      )}
      {identify && (
        <div>
          <StandardButton text="Identify" type="round" />
        </div>
      )}
      {join && (
        <div>
          <StandardButton text="About" type="round" />
        </div>
      )}
    </div>
  );
};

export default ButtonGroup;
