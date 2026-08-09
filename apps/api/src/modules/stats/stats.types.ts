import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class StatusCount {
  @Field()
  status: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class TimeSeriesPoint {
  @Field()
  date: string;

  @Field(() => Int)
  count: number;
}

@ObjectType()
export class DashboardStats {
  @Field(() => Int)
  totalVisits: number;

  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  totalMessages: number;

  @Field(() => Int)
  totalArticles: number;

  @Field(() => Int)
  totalPosts: number;

  @Field(() => Int)
  totalLikes: number;

  @Field(() => Int)
  totalDislikes: number;

  @Field(() => [StatusCount])
  articlesByStatus: StatusCount[];

  @Field(() => [StatusCount])
  postsByStatus: StatusCount[];

  @Field(() => [TimeSeriesPoint])
  visitsOverTime: TimeSeriesPoint[];

  @Field(() => [TimeSeriesPoint])
  usersOverTime: TimeSeriesPoint[];

  @Field(() => [TimeSeriesPoint])
  messagesOverTime: TimeSeriesPoint[];

  @Field(() => [TimeSeriesPoint])
  articlesOverTime: TimeSeriesPoint[];
}
