import { NextPage, GetServerSideProps } from 'next';
import React from 'react';
import * as tf from '@tensorflow/tfjs';

interface PageProps {
  predictedResult: number | null;
}

const Page: NextPage<PageProps> = ({ predictedResult }) => {
  if (predictedResult === null) {
    return null;
  }

  return (
    <div>
      <h1>TensorFlow.js Linear Regression</h1>
      <p>Predicted Next Opening Price: {predictedResult.toFixed(2)}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async () => {
  const data: [number, number][] = [
    [32994.19107, 37818.88],
    [24740.29147, 37854.65],
    [43415.66324, 37723.97],
    [26696.92161, 38682.51],
    [26710.65335, 39450.35],
    [79272.33059, 39972.26],
    [67490.74644, 41991.1],
    [51431.10492, 44073.82],
    [47103.26845, 43762.69],
    [42900.37556, 43273.15],
    [24925.97008, 44171.],
    [18956.61758, 43713.59],
    [21909.41229, 43789.5],
  ];

  const tensorX = tf.tensor2d(data.map(item => item[0]), [data.length, 1]);
  const tensorY = tf.tensor2d(data.map(item => item[1]), [data.length, 1]);

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
  model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

  const epochs = 2000;
  await model.fit(tensorX, tensorY, { epochs });

  const [slope, intercept] = (model.getWeights() as tf.Tensor<tf.Rank.R0>[]).map(w => w.arraySync());

  const lastDataPoint = data[data.length - 1][0];
  const predictedNextOpeningPrice = slope * lastDataPoint + intercept;

  return {
    props: {
      predictedResult: predictedNextOpeningPrice,
    },
  };
};

export default Page;
