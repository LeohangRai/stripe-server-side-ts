import { myDataSource } from '../app-data-source';
import { UserEntity } from '../entity/user.entity';
const userRepository = myDataSource.getRepository(UserEntity);

export const createUser = function (data: Partial<UserEntity>) {
  const userData = userRepository.create(data);
  return userRepository.save(userData);
};

export const findAllUsers = function () {
  return userRepository.find();
};

export const findUserByEmail = function (email: string) {
  return userRepository.findOneBy({
    email
  });
};
