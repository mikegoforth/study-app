import { ParsedUrlQuery } from 'querystring';
import { GetStaticProps } from 'next';
import { defaultMetaProps } from '@/components/layout/meta';
import { getUser, getAllUsers, getUserCount } from '@/lib/api/user';
export { default } from '.';
import clientPromise from '@/lib/mongodb';

interface Params extends ParsedUrlQuery {
  username: string;
}

export const getStaticPaths = async () => {

  const results = await getAllUsers();
  const paths = results.flatMap(({ users }) =>
    users.map((user) => ({ params: { username: user.username } }))
  );
  return {
    paths,
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async (context) => {

  const { username } = context.params as Params;
  const user = await getUser(username);
  if (!user) {
    return {
      notFound: true,
      revalidate: 10
    };
  }

  const results = await getAllUsers();
  const totalUsers = await getUserCount();

  const ogUrl = `https://mongodb.vercel.app/${user.username}`;
  const meta = {
    ...defaultMetaProps,
    title: `${user.name}'s Profile | MongoDB Starter Kit`,
    ogImage: `https://api.microlink.io/?url=${ogUrl}&screenshot=true&meta=false&embed=screenshot.url`,
    ogUrl: `https://mongodb.vercel.app/${user.username}`
  };

  return {
    props: {
      meta,
      results,
      totalUsers,
      user
    },
    revalidate: 10
  };
};
