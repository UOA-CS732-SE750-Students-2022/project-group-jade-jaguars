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
import Router, { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

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
      <Container mt={200}>
        <h1>Enter your invitation code</h1>
        <Paper p="xl" radius="md" withBorder>
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
      </Container>
    </>
  );
};
export default JoinPage;
