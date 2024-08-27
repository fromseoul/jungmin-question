import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const queryKey = ['board'];

export const useBoardDetailQuery = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKey, id],
    queryFn: async () => {
      return await axios.get(`https://api.github.com/repos/octocat/Spoon-Knife/issues/${id}`, {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          Accept: 'application/vnd.github.v3+json',
        },
      });
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });

  return { data: data ? data.data : [], isLoading, error };
};
