import BaseData from './BaseData';
import UserStore from './UserStore';

export default class UserData extends BaseData {
  constructor() {
    const props = {
      fieldMap: UserStore.user,
      fieldMapSnapshot: UserStore.userSchema
    };
    super(props);
  }
}
