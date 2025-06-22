import type { ReactionResponse } from "~/types";

import { Button, ButtonGroup } from "@heroui/react";
import { useAuth } from "~/hooks/use-auth";
import { handleError, http } from "~/lib/http";
import { ReactionType } from "~/models/enums";
import { LucideThumbsDown, LucideThumbsUp } from "lucide-react";
import useSWR from "swr";

interface ReactionButtonsProps {
  postId: string;
}

export function ReactionButtons({ postId }: ReactionButtonsProps) {
  const { user } = useAuth();

  const {
    data: reactions,
    isValidating,
    mutate
  } = useSWR<ReactionResponse>(`/posts/${postId}/reactions`);

  const myReaction = reactions?.items.find(
    (reaction) => reaction.userId === user?.id
  );

  const onReact = async (type: ReactionType) => {
    const existingReaction = myReaction?.type === type;
    try {
      if (existingReaction) {
        await http.delete(`reactions/${myReaction.id}`);
      } else {
        await http.post("reactions", { postId, type });
      }
      mutate();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <ButtonGroup
      isDisabled={isValidating}
      variant='light'
    >
      <Button onPress={() => onReact(ReactionType.LIKE)}>
        <LucideThumbsUp size={20} />
        <span className='text-lg'>{reactions?.meta.likes}</span>
      </Button>
      <Button onPress={() => onReact(ReactionType.DISLIKE)}>
        <LucideThumbsDown size={20} />
        <span className='text-lg'>{reactions?.meta.dislikes}</span>
      </Button>
    </ButtonGroup>
  );
}
