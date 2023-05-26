"""empty message

Revision ID: 4403bed8cf59
Revises: 
Create Date: 2023-05-25 20:35:48.301201

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '4403bed8cf59'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('cell',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.Text(), nullable=False),
    sa.Column('location', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('logger',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.Text(), nullable=False),
    sa.Column('mac', postgresql.MACADDR(), nullable=True),
    sa.Column('hostname', sa.Text(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('power_data',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('logger_id', sa.Integer(), nullable=True),
    sa.Column('cell_id', sa.Integer(), nullable=False),
    sa.Column('ts', sa.DateTime(), nullable=False),
    sa.Column('ts_server', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('current', sa.Integer(), nullable=True),
    sa.Column('voltage', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['cell_id'], ['cell.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['logger_id'], ['logger.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('teros_data',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('cell_id', sa.Integer(), nullable=False),
    sa.Column('ts', sa.DateTime(), nullable=False),
    sa.Column('ts_server', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
    sa.Column('vwc', sa.Float(), nullable=True),
    sa.Column('temp', sa.Float(), nullable=True),
    sa.Column('ec', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['cell_id'], ['cell.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('teros_data')
    op.drop_table('power_data')
    op.drop_table('logger')
    op.drop_table('cell')
    # ### end Alembic commands ###
