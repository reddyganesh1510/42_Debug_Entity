import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockDocAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'Aadhar Card',
  'Pan Card',
  'Driving License',
  'Birth Certificate',
  'Domicile Certificate',
  'SSC Passing Certificate',
  'HSC Passing Certificate',
  'Voting Card'
];

const PRODUCT_COLOR = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107'
];

// ----------------------------------------------------------------------

const products = [...Array(8)].map((_, index) => {
  const setIndex = index + 1;
  const pic = setIndex % 4;
  return {
    id: faker.datatype.uuid(),
    cover: mockDocAvatar(pic),
    name: PRODUCT_NAME[index],
    price: faker.datatype.number({ min: 4, max: 99, precision: 0.01 }),
    priceSale: setIndex % 3 ? null : faker.datatype.number({ min: 19, max: 29, precision: 0.01 }),
    colors:
      (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
      (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
      (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
      (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
      PRODUCT_COLOR,
    status: sample(['new', 'needs attention', ''])
  };
});

export default products;
