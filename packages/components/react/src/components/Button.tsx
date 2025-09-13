export default function Button() {
  const handleClick = () => {
    alert('Button clicado!');
  };

  return (
    <button type="button" onClick={handleClick}>
      Button
    </button>
  );
}
