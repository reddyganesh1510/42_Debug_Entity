import faker from 'faker';
import { sample } from 'lodash';
// utils
import { mockImgAvatar } from '../utils/mockImages';

// ----------------------------------------------------------------------

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: mockImgAvatar(index + 1),
  name: faker.name.findName(),
  company: sample([
    'Aadhar Card',
    'Pan Card',
    'Driving License',
    'Birth Certificate',
    'Domicile Certificate',
    'Passing Certificate'
  ]),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned', 'rejected']),
  role: sample(['Verified User', 'New User'])
}));

export default users;
