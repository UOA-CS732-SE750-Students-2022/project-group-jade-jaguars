import {
  Button,
  Container,
  Paper,
  TextInput,
  Grid,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';

const JoinPage: NextPage = () => {
  const form = useForm({
    initialValues: {
      code: '',
    },
  });
  const router = useRouter();
  const onClick = () => {
    router.push({
      pathname: '/availability',
      query: {
        eventId: form.values.code,
      },
    });
  };

  return (
    <>
      <Container style={{ maxWidth: '100vw' }} className="m-0 p-0">
        <div className="min-w-[1200px] flex flex-col h-full gap-5 py-28 w-full items-center justify-center">
          <h1>Enter your invitation code</h1>
          <Paper style={{ width: '700px' }} p="xl" radius="md" withBorder>
            <Grid>
              <Grid.Col>
                <TextInput
                  value={form.values.code}
                  placeholder="enter your code"
                  onChange={(e) =>
                    form.setFieldValue('code', e.currentTarget.value)
                  }
                />
              </Grid.Col>
              <Grid.Col>
                <Group position="right" mt="lg">
                  <Button
                    classNames={{
                      filled: 'bg-[#FFDF74] hover:bg-[#FFDF74]',
                      label: 'text-black',
                      root: 'hover:bg-[#ffeeb0]',
                    }}
                    onClick={onClick}
                  >
                    <p className="font-medium">Submit</p>
                  </Button>
                </Group>
              </Grid.Col>
            </Grid>
          </Paper>
        </div>
      </Container>
    </>
  );
};
export default JoinPage;
