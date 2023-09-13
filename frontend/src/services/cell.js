import { useQuery, useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { DateTime } from 'luxon';

export const getCellData = (cellId, startTime, endTime) => {
  return axios
    .get(`${process.env.PUBLIC_URL}/api/cell/data/${cellId}?startTime=${startTime}&endTime=${endTime}`)
    .then((res) => res.data);
};

export const useCellData = (cells, startTime = DateTime.now().minus({ months: 1 }), endTime = DateTime.now()) =>
  useQueries({
    queries: [
      cells.map((cell) => {
        return {
          queryKey: [cell.id],
          queryFn: () => getCellData(cell.id, startTime, endTime),
          enabled: cells.length != 0,
          refetchOnWindowFocus: false,
        };
      }),
    ],
  });

export const getCells = () => {
  return axios.get(`${process.env.PUBLIC_URL}/api/cell/id`).then((res) => res.data);
};

export const useCells = () =>
  useQuery({
    queryKey: ['cell info'],
    queryFn: () => getCells(),
    refetchOnWindowFocus: false,
  });
