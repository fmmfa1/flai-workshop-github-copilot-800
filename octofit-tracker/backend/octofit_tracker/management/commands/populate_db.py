from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import date, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Deleting existing data...')
        
        # Delete all existing data
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Existing data deleted'))
        
        # Create teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Assemble! The mightiest heroes of the Marvel Universe',
            members=[]
        )
        
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League - Defenders of truth and justice',
            members=[]
        )
        
        self.stdout.write(self.style.SUCCESS('Teams created'))
        
        # Create users (superheroes)
        self.stdout.write('Creating users...')
        marvel_heroes = [
            {'name': 'Iron Man', 'email': 'tony.stark@marvel.com'},
            {'name': 'Captain America', 'email': 'steve.rogers@marvel.com'},
            {'name': 'Thor', 'email': 'thor.odinson@marvel.com'},
            {'name': 'Black Widow', 'email': 'natasha.romanoff@marvel.com'},
            {'name': 'Hulk', 'email': 'bruce.banner@marvel.com'},
            {'name': 'Spider-Man', 'email': 'peter.parker@marvel.com'},
        ]
        
        dc_heroes = [
            {'name': 'Superman', 'email': 'clark.kent@dc.com'},
            {'name': 'Batman', 'email': 'bruce.wayne@dc.com'},
            {'name': 'Wonder Woman', 'email': 'diana.prince@dc.com'},
            {'name': 'The Flash', 'email': 'barry.allen@dc.com'},
            {'name': 'Aquaman', 'email': 'arthur.curry@dc.com'},
            {'name': 'Green Lantern', 'email': 'hal.jordan@dc.com'},
        ]
        
        marvel_users = []
        dc_users = []
        
        for hero in marvel_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                team='Team Marvel'
            )
            marvel_users.append(user)
        
        for hero in dc_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                team='Team DC'
            )
            dc_users.append(user)
        
        all_users = marvel_users + dc_users
        
        # Update team members
        team_marvel.members = [u.email for u in marvel_users]
        team_marvel.save()
        
        team_dc.members = [u.email for u in dc_users]
        team_dc.save()
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(all_users)} users'))
        
        # Create activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga', 'Combat Training']
        
        activities_created = 0
        for user in all_users:
            # Create 5-10 activities per user
            num_activities = random.randint(5, 10)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 120)
                calories = duration * random.randint(5, 10)
                activity_date = date.today() - timedelta(days=random.randint(0, 30))
                
                Activity.objects.create(
                    user_id=str(user._id),
                    user_name=user.name,
                    activity_type=activity_type,
                    duration=duration,
                    calories=calories,
                    date=activity_date
                )
                activities_created += 1
        
        self.stdout.write(self.style.SUCCESS(f'Created {activities_created} activities'))
        
        # Create leaderboard entries
        self.stdout.write('Creating leaderboard...')
        leaderboard_data = []
        
        for user in all_users:
            user_activities = Activity.objects.filter(user_id=str(user._id))
            total_calories = sum(a.calories for a in user_activities)
            total_activities = user_activities.count()
            
            leaderboard_data.append({
                'user': user,
                'total_calories': total_calories,
                'total_activities': total_activities
            })
        
        # Sort by total calories
        leaderboard_data.sort(key=lambda x: x['total_calories'], reverse=True)
        
        for rank, data in enumerate(leaderboard_data, start=1):
            Leaderboard.objects.create(
                user_id=str(data['user']._id),
                user_name=data['user'].name,
                team=data['user'].team,
                total_calories=data['total_calories'],
                total_activities=data['total_activities'],
                rank=rank
            )
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(leaderboard_data)} leaderboard entries'))
        
        # Create workouts
        self.stdout.write('Creating workouts...')
        workouts = [
            {
                'name': 'Super Soldier Training',
                'description': 'Captain America\'s legendary training routine',
                'difficulty': 'Hard',
                'duration': 60,
                'calories_estimate': 600,
                'exercises': [
                    {'name': 'Push-ups', 'reps': 50},
                    {'name': 'Pull-ups', 'reps': 30},
                    {'name': 'Squats', 'reps': 100},
                    {'name': 'Sprints', 'duration': '10 minutes'}
                ]
            },
            {
                'name': 'Asgardian Warrior Workout',
                'description': 'Thor\'s mighty strength training',
                'difficulty': 'Very Hard',
                'duration': 90,
                'calories_estimate': 900,
                'exercises': [
                    {'name': 'Hammer Swings', 'reps': 50},
                    {'name': 'Battle Rope', 'duration': '5 minutes'},
                    {'name': 'Deadlifts', 'reps': 20},
                    {'name': 'Box Jumps', 'reps': 30}
                ]
            },
            {
                'name': 'Web-Slinger Cardio',
                'description': 'Spider-Man\'s agility and cardio routine',
                'difficulty': 'Medium',
                'duration': 45,
                'calories_estimate': 450,
                'exercises': [
                    {'name': 'Burpees', 'reps': 30},
                    {'name': 'Mountain Climbers', 'reps': 50},
                    {'name': 'Jump Rope', 'duration': '10 minutes'},
                    {'name': 'Agility Ladder', 'duration': '5 minutes'}
                ]
            },
            {
                'name': 'Bat-Training',
                'description': 'Batman\'s tactical combat conditioning',
                'difficulty': 'Hard',
                'duration': 75,
                'calories_estimate': 750,
                'exercises': [
                    {'name': 'Martial Arts Practice', 'duration': '20 minutes'},
                    {'name': 'Rope Climbing', 'reps': 10},
                    {'name': 'Plank Hold', 'duration': '3 minutes'},
                    {'name': 'Shadow Boxing', 'duration': '15 minutes'}
                ]
            },
            {
                'name': 'Kryptonian Power Session',
                'description': 'Superman\'s strength and endurance workout',
                'difficulty': 'Very Hard',
                'duration': 120,
                'calories_estimate': 1200,
                'exercises': [
                    {'name': 'Heavy Lifts', 'reps': 50},
                    {'name': 'Flight Training', 'duration': '30 minutes'},
                    {'name': 'Heat Vision Focus', 'duration': '10 minutes'},
                    {'name': 'Super Speed Runs', 'duration': '20 minutes'}
                ]
            },
            {
                'name': 'Amazonian Yoga Flow',
                'description': 'Wonder Woman\'s flexibility and balance routine',
                'difficulty': 'Easy',
                'duration': 30,
                'calories_estimate': 200,
                'exercises': [
                    {'name': 'Warrior Pose', 'duration': '5 minutes'},
                    {'name': 'Balance Training', 'duration': '10 minutes'},
                    {'name': 'Meditation', 'duration': '10 minutes'},
                    {'name': 'Stretching', 'duration': '5 minutes'}
                ]
            },
        ]
        
        for workout_data in workouts:
            Workout.objects.create(**workout_data)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(workouts)} workouts'))
        
        self.stdout.write(self.style.SUCCESS('Database population completed successfully!'))
