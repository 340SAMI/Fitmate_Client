import React from 'react';
import { RotatingSquare, ThreeDots } from 'react-loader-spinner';

const Loading = () => {
    return (
        <div>

        (<ThreeDots
            visible={true}
            height="100"
            width="100"
            color="#341087"
            radius="9"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClass=""
        />)

        </div>
    );
};

export default Loading;