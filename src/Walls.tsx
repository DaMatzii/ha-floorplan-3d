interface WallData {
  id: string;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  height: number;
  thickness: number;
}

const Wall: React.FC<WallData> = ({
  xStart,
  yStart,
  xEnd,
  yEnd,
  height,
  thickness,
}) => {
  const dx = xEnd - xStart;
  const dy = yEnd - yStart;
  const length = Math.sqrt(dx ** 2 + dy ** 2);
  const angle = Math.atan2(dy, dx);

  const position: [number, number, number] = [
    (xStart + xEnd) / 2,
    height / 2,
    (yStart + yEnd) / 2,
  ];

  return (
    <mesh position={position} rotation={[0, -angle, 0]}>
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

interface WallsSceneProps {
  walls: WallData[];
}

const WallsScene: React.FC<WallsSceneProps> = ({ walls, rooms }) => {
  // console.log(rooms);
  // console.log(walls);
  return (
    <>
      {walls.map((wall) => (
        <Wall key={wall.id} {...wall} />
      ))}
    </>
  );
};
// {
// rooms.map((points, idx) => (
// <RoomMesh
// key={idx}
// points={points.points}
// color={idx % 2 === 0 ? "orange" : "green"}
// />
// ));
/
