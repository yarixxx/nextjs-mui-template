import {
    Button, Card, CardContent,
} from '@mui/material';
import Box from "@mui/material/Box";
import {createClient} from "@/src/lib/supabase/client";

export default function SignupForm() {
    const supabase = createClient()

    async function signInGoogle() {
        await supabase.auth.linkIdentity({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    async function signInApple() {
        await supabase.auth.linkIdentity({
            provider: 'apple',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        })
    }

    return (
        <Box>
            <Card variant="outlined"
                  sx={{
                      minWidth: 250,
                      flex: "1 1 250px",
                      maxWidth: 250,
                  }}>
                <CardContent>
                    <Button
                        variant="contained"
                        onClick={signInGoogle}
                    >
                        Continue with Google
                    </Button>
                    <Button
                        variant="contained"
                        onClick={signInApple}
                    >
                        Continue with Apple
                    </Button>
                </CardContent>
            </Card>
        </Box>
    )
}
