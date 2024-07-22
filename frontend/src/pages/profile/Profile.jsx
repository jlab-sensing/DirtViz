import { React } from 'react';
import AddCellModal from './components/AddCellModal';
import useAuth from '../../auth/hooks/useAuth';

function Profile() {
  const { user } = useAuth();
    return (
    <>
      <h1> {user.email}</h1>
      <AddCellModal />
    </>
  );
}

export default Profile;
