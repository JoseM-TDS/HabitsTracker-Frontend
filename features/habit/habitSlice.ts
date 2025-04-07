import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { fetchHabits, fetchAddHabit } from "./habitAPI";

type Habit = {
    _id: string;
    title: string;
    description: string;
    createdAt: string;
    days: number;
    lastDone: Date;
    lastUpdate: Date;
    startedAt: Date;
}
type markAsDoneThunkParams = {
    habitId: string;
    token: string
}
type addHabbitThunkParams = {
    token: string;
    title: string;
    description: string;
}
type HabitState = {
    habits: Habit[];
    status: Record<string, "idle" | "loading" | "success" | "failed">;
    error: Record<string, string | null>;
}

const initialState: HabitState = {
    habits: [],
    status: {},
    error: {}
}

export const fetchHabitsThunk = createAsyncThunk('habits/fetchHabits', async (token: string, {rejectWithValue}) => {
    const response = await fetchHabits(token);
    const responseJson = await response.json();
    if(!response.ok) {
        return rejectWithValue("Failed to fetch habits");
    }
    return responseJson;
})

export const markAsDoneThunk = createAsyncThunk("habit/markAsDone", async ({habitId, token}:markAsDoneThunkParams, { rejectWithValue }) => {
    const response = await fetch(`http://localhost:3001/habits/markasdone/${habitId}`, {
        method: "PATCH",
        headers: {Authorization: 'Bearer '+token}
    });
    const responseJson = await response.json();
    if (!response.ok) {
        return rejectWithValue("Failed to mark habit as done");
    }else if(responseJson.message.toString() === "Habito se ha reiniciado"){
        return rejectWithValue(responseJson.message);
    }else{
        return responseJson.message;
    }
});

export const fetchAddHabitThunk = createAsyncThunk("user/fetchAddHabit", async ({token, title, description}: addHabbitThunkParams,  {rejectWithValue}) => {
    const response = await fetchAddHabit(token, title, description);
    const responseJson = await response.json();
    if (!response.ok) {
        throw new Error("Failed to login user");
    }else if(responseJson.message.toString() === "Error al crear habito"  ){
        return rejectWithValue(responseJson.message);
    }else{
        return responseJson.token; 
    }
});

const habitSlice = createSlice({
    name: 'habits',
    initialState,
    reducers: {
        addHabits: (state, action) => {
            state.habits = action.payload;
        },
        addHabit: (state, action) => {
            state.habits.push(action.payload);
        },
        removeHabit: (state, action) => {
            state.habits = state.habits.filter(habit => habit._id !== action.payload);
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchHabitsThunk.fulfilled, (state, action) => {
            state.habits = action.payload;
        }).addCase(markAsDoneThunk.fulfilled, (state, action) => {
            state.status[action.meta.arg.habitId] = "success";
            state.error[action.meta.arg.habitId] = null;
        }).addCase(markAsDoneThunk.rejected, (state, action) => {
            state.status[action.meta.arg.habitId] = "failed";
            state.error[action.meta.arg.habitId] = action.payload as string;
        }).addCase(fetchAddHabitThunk.fulfilled, (state, action) => {
            state.habits.push(action.payload);
        })
    }
});

export const { addHabits, addHabit, removeHabit } = habitSlice.actions;
export default habitSlice.reducer;