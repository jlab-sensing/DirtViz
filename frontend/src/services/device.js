import useAxiosPrivate from '../auth/hooks/useAxiosPrivate';

const axiosPrivate = useAxiosPrivate();

export async function addDevice(name) {
    try {
      return await axiosPrivate
        .post(`${process.env.PUBLIC_URL}/device`, {
          name: name
        })
        .then((res) => res.data.api_key);
    } catch (err) {
      console.error(err);
    }
  }
