import { useState, useEffect } from "react";
import { Box, Heading, Text, Button, Input, Textarea, Stack, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash, FaSave } from "react-icons/fa";

const SUPABASE_URL = "https://mnwefvnykbgyhbdzpleh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ud2Vmdm55a2JneWhiZHpwbGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMyNzQ3MzQsImV4cCI6MjAyODg1MDczNH0.tnHysd1LqayzpQ1L-PImcvlkUmkNvocpMS7tS-hYZNg";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/notes`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    const { data, error } = await res.json();
    if (error) {
      console.error("Error fetching notes:", error);
    } else {
      setNotes(data);
    }
  };

  const createNote = async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ note }),
    });
    const { data, error } = await res.json();
    if (error) {
      console.error("Error creating note:", error);
      toast({
        title: "Error creating note",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setNotes([...notes, data[0]]);
      setNote("");
      toast({
        title: "Note created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateNote = async (id) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/notes?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ note }),
    });
    const { data, error } = await res.json();
    if (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Error updating note",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setNotes(notes.map((n) => (n.id === id ? data[0] : n)));
      setNote("");
      setEditingNoteId(null);
      toast({
        title: "Note updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteNote = async (id) => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/notes?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    const { error } = await res.json();
    if (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error deleting note",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setNotes(notes.filter((n) => n.id !== id));
      toast({
        title: "Note deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="600px" margin="auto" padding={4}>
      <Heading as="h1" size="xl" textAlign="center" marginBottom={8}>
        Notes App
      </Heading>
      <Stack spacing={4}>
        <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Write a note..." />
        <Button onClick={() => (editingNoteId ? updateNote(editingNoteId) : createNote())} colorScheme="blue" leftIcon={<FaSave />}>
          {editingNoteId ? "Update Note" : "Save Note"}
        </Button>
      </Stack>
      <Stack spacing={4} marginTop={8}>
        {notes.map((note) => (
          <Box key={note.id} borderWidth={1} borderRadius="md" padding={4} backgroundColor="gray.100">
            <Text>{note.note}</Text>
            <Stack direction="row" spacing={4} marginTop={4}>
              <Button
                onClick={() => {
                  setNote(note.note);
                  setEditingNoteId(note.id);
                }}
                size="sm"
                colorScheme="green"
              >
                Edit
              </Button>
              <Button onClick={() => deleteNote(note.id)} size="sm" colorScheme="red" leftIcon={<FaTrash />}>
                Delete
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Index;
