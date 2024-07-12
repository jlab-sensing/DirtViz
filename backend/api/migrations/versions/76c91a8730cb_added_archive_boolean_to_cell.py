"""added archive boolean to cell

Revision ID: 76c91a8730cb
Revises: caf4baaaa14f
Create Date: 2024-06-24 14:52:26.255431

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "76c91a8730cb"
down_revision = "caf4baaaa14f"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("cell", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("archive", sa.Boolean(), nullable=False, server_default="false")
        )

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("cell", schema=None) as batch_op:
        batch_op.drop_column("archive")

    # ### end Alembic commands ###
