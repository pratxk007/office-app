'use client';
import { db } from '@/configs/db';
import { Users } from '@/configs/schema';
import { useUser } from '@clerk/nextjs';
import { eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';

function Provider({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    
    const [isUserReady, setIsUserReady] = useState(false);

    useEffect(() => {
        if (user) {
            setIsUserReady(true);
        }
    }, [user]);

    const isNewUser = async () => {
        if (!user) return;

        const email = user?.primaryEmailAddress?.emailAddress;

        if (email) {
            const result = await db
                .select()
                .from(Users)
                .where(eq(Users.email, email));
            if (!result[0]) {
                await db.insert(Users).values({
                    name: user?.fullName || '',
                    email: email,
                    imageUrl: user?.imageUrl || '',
                });
            }
        }
    };

    useEffect(() => {
        if (isUserReady) {
            isNewUser();
        }
    }, [isUserReady]);

    return <div>{children}</div>;
}

export default Provider;
