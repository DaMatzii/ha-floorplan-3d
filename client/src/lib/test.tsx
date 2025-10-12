import Wall from "@/components/scene/Wall";

function Test({ text }) {
  return <>{text}</>;
}

const defaultComponents = {
  Wall: (props) => <Test {...props} />,
  Date: () => <input type="date" />,
  Number: () => <input type="number" />,
};

export function renderComponent() {
  return defaultComponents["Wall"];
}
