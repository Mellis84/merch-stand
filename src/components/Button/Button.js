import styles from './Button.module.scss';

const Button = ({ children, className, colour, ...rest }) => {
  let buttonClassName = styles.button;

  if (className) {
    buttonClassName = `${buttonClassName} ${className}`;
  }

  return (
    <button className={buttonClassName} data-color={colour} {...rest}>
      {children}
    </button>
  );
};

export default Button;
