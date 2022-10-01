import React from 'react';

type Props = {
  placeholder: string;
  error?: string;
  type?: string;
  registerObject: any;
};
const Input = React.forwardRef((props: Props, ref) => {
  return (
    <div className="mb-6">
      <input
        ref={ref}
        {...props.registerObject}
        type={props.type}
        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
        placeholder={props.placeholder}
      />
      <p className="text-red-600">{props.error}</p>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
