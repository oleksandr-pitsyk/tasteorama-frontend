import { FidgetSpinner } from 'react-loader-spinner';

import css from './Loading.module.css';

const Loading = () => {
  return (
    <div className={css.loaderwrapper}>
      <FidgetSpinner
        visible={true}
        height="120"
        width="120"
        ariaLabel="fidget-spinner-loading"
        wrapperStyle={{}}
        wrapperClass="fidget-spinner-wrapper"
      />
    </div>
  );
};

export default Loading;
