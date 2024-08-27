import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type Params = {
  page: string;
  per_page: string;
  keyword?: string;
  type?: string;
};

const queryKey = ['board-search'];
export const useBoardSearchQuery = (params: Params) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [...queryKey, params],
    queryFn: async () => {
      return await axios.get('https://api.github.com/search/topics', {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          Accept: 'application/vnd.github.v3+json',
        },
        params: {
          page: params.page ? params.page : '1',
          per_page: params.per_page ? params.per_page : '10',
          ...(params.keyword && { q: params.keyword }),
        },
      });
    },
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    enabled: !!params.keyword,
  });

  let nextPage: any = null;
  let lastPage: any = null;

  if (data && data.headers && data.headers.link) {
    const linkHeader = data.headers.link;
    const links = linkHeader.split(',').map((link: any) => link.trim());

    links.forEach((link: any) => {
      const [urlPart, relPart] = link.split(';').map((part: any) => part.trim());
      const url = urlPart.slice(1, -1);
      const rel = relPart.split('=')[1].replace(/"/g, '');

      const urlParams = new URLSearchParams(url.split('?')[1]);
      const page = urlParams.get('page');

      if (rel === 'next') {
        nextPage = page;
      } else if (rel === 'last') {
        lastPage = page;
      } else if (rel === 'first' && !lastPage) {
        lastPage = params.page;
      }
    });
  }

  return { data: data ? data.data.items : undefined, lastPage, nextPage, isLoading, error };
};
